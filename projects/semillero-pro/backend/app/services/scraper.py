"""
SEMILLERO PRO - Servicio de Scraping Avanzado
Scraping robusto de Transfermarkt con User-Agent rotation y manejo de errores
"""

import random
import time
from typing import Dict, Optional, List
from datetime import datetime
import logging

import requests
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session

from app.config import settings
from app.models.models import Player

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class TransfermarktScraper:
    """
    Scraper avanzado para Transfermarkt con protección anti-bloqueo
    """
    
    def __init__(self):
        self.session = requests.Session()
        self.base_url = "https://www.transfermarkt.com"
        
    def _get_random_headers(self) -> Dict[str, str]:
        """
        Genera headers con User-Agent rotativo para evitar detección
        """
        return {
            'User-Agent': random.choice(settings.USER_AGENTS),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0',
        }
    
    def _make_request(self, url: str, retries: int = 3) -> Optional[requests.Response]:
        """
        Realiza una petición HTTP con reintentos y delays
        """
        for attempt in range(retries):
            try:
                # Delay aleatorio para parecer más humano
                time.sleep(random.uniform(1.5, 3.5))
                
                response = self.session.get(
                    url,
                    headers=self._get_random_headers(),
                    timeout=15
                )
                
                if response.status_code == 200:
                    logger.info(f"✅ Scraping exitoso: {url}")
                    return response
                elif response.status_code == 403:
                    logger.warning(f"⚠️ Bloqueado (403) en intento {attempt + 1}/{retries}")
                    time.sleep(5 * (attempt + 1))  # Espera incremental
                else:
                    logger.warning(f"⚠️ Status {response.status_code} en intento {attempt + 1}/{retries}")
                    
            except requests.exceptions.RequestException as e:
                logger.error(f"❌ Error en petición: {e}")
                time.sleep(3)
        
        logger.error(f"❌ Fallo después de {retries} intentos: {url}")
        return None
    
    def scrape_transfermarkt_profile(self, url: str) -> Optional[Dict]:
        """
        Extrae el perfil completo de un jugador desde Transfermarkt
        
        Args:
            url: URL del perfil del jugador en Transfermarkt
            
        Returns:
            Dict con los datos del jugador o None si falla
        """
        try:
            response = self._make_request(url)
            if not response:
                return None
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Extraer datos básicos
            player_data = {
                'name': self._extract_name(soup),
                'birth_date': self._extract_birth_date(soup),
                'nationality': self._extract_nationality(soup),
                'position': self._extract_position(soup),
                'market_value_usd': self._extract_market_value(soup),
                'current_club': self._extract_current_club(soup),
                'transfermarkt_url': url,
                'last_scraped_at': datetime.utcnow()
            }
            
            # Extraer estadísticas de rendimiento
            stats = self._extract_performance_stats(soup)
            player_data.update(stats)
            
            logger.info(f"✅ Datos extraídos: {player_data['name']}")
            return player_data
            
        except Exception as e:
            logger.error(f"❌ Error scrapeando {url}: {str(e)}")
            return None
    
    def _extract_name(self, soup: BeautifulSoup) -> str:
        """Extrae el nombre del jugador"""
        try:
            # Método 1: Header principal
            name_elem = soup.find('h1', class_='data-header__headline-wrapper')
            if name_elem:
                return name_elem.get_text(strip=True)
            
            # Método 2: Fallback
            name_elem = soup.find('span', class_='dataName')
            if name_elem:
                return name_elem.get_text(strip=True)
            
            return "Desconocido"
        except:
            return "Desconocido"
    
    def _extract_birth_date(self, soup: BeautifulSoup) -> Optional[datetime]:
        """Extrae la fecha de nacimiento"""
        try:
            # Buscar en el bloque de información
            info_table = soup.find('span', class_='info-table__content', string=lambda t: t and 'Fecha de nacimiento' in t or 'Date of birth' in t)
            if info_table:
                parent = info_table.find_parent('span', class_='info-table__content')
                if parent:
                    date_text = parent.get_text(strip=True)
                    # Parsear fecha (formato puede variar)
                    # Implementar parsing según formato observado
                    return None  # Simplificado para MVP
            return None
        except:
            return None
    
    def _extract_nationality(self, soup: BeautifulSoup) -> str:
        """Extrae la nacionalidad"""
        try:
            flag_elem = soup.find('img', class_='flaggenrahmen')
            if flag_elem and flag_elem.has_attr('title'):
                return flag_elem['title']
            return "Desconocido"
        except:
            return "Desconocido"
    
    def _extract_position(self, soup: BeautifulSoup) -> str:
        """Extrae la posición del jugador"""
        try:
            # Buscar en el header
            position_elem = soup.find('span', class_='info-table__content', string=lambda t: t and 'Posición' in t or 'Position' in t)
            if position_elem:
                parent = position_elem.find_next_sibling()
                if parent:
                    return parent.get_text(strip=True)
            return "Desconocido"
        except:
            return "Desconocido"
    
    def _extract_market_value(self, soup: BeautifulSoup) -> float:
        """Extrae el valor de mercado y lo convierte a USD"""
        try:
            # Buscar el valor de mercado
            value_elem = soup.find('a', class_='data-header__market-value-wrapper')
            if not value_elem:
                value_elem = soup.find('span', class_='waehrung')
            
            if value_elem:
                value_text = value_elem.get_text(strip=True)
                # Parsear valor (ej: "€5.00m", "$10.00m")
                value_cleaned = value_text.replace('€', '').replace('$', '').replace('m', '').replace(',', '.')
                
                # Convertir a USD (simplificado - en producción usar API de cambio)
                if 'mill' in value_text.lower() or 'm' in value_text:
                    return float(value_cleaned) * 1_000_000
                elif 'k' in value_text.lower():
                    return float(value_cleaned) * 1_000
                
            return 0.0
        except:
            return 0.0
    
    def _extract_current_club(self, soup: BeautifulSoup) -> str:
        """Extrae el club actual"""
        try:
            club_elem = soup.find('span', class_='data-header__club')
            if club_elem:
                club_link = club_elem.find('a')
                if club_link:
                    return club_link.get_text(strip=True)
            return "Sin club"
        except:
            return "Sin club"
    
    def _extract_performance_stats(self, soup: BeautifulSoup) -> Dict:
        """
        Extrae estadísticas de rendimiento (goles, asistencias, minutos)
        """
        stats = {
            'goals': 0,
            'assists': 0,
            'minutes_played': 0,
            'matches_played': 0
        }
        
        try:
            # Buscar tabla de estadísticas de la temporada actual
            stats_table = soup.find('table', class_='items')
            if not stats_table:
                return stats
            
            # Buscar la fila de totales o la última temporada
            rows = stats_table.find_all('tr')
            if len(rows) > 1:
                # Última fila suele tener los totales
                last_row = rows[-1]
                cells = last_row.find_all('td')
                
                if len(cells) >= 8:
                    try:
                        stats['matches_played'] = int(cells[3].get_text(strip=True) or 0)
                        stats['goals'] = int(cells[5].get_text(strip=True) or 0)
                        stats['assists'] = int(cells[6].get_text(strip=True) or 0)
                        stats['minutes_played'] = int(cells[8].get_text(strip=True).replace('.', '').replace("'", '') or 0)
                    except ValueError:
                        pass
            
            return stats
            
        except Exception as e:
            logger.warning(f"⚠️ No se pudieron extraer estadísticas: {e}")
            return stats
    
    def search_player(self, player_name: str) -> List[Dict]:
        """
        Busca jugadores por nombre en Transfermarkt
        
        Returns:
            Lista de jugadores encontrados con sus URLs
        """
        try:
            search_url = f"{self.base_url}/schnellsuche/ergebnis/schnellsuche?query={player_name.replace(' ', '+')}"
            response = self._make_request(search_url)
            
            if not response:
                return []
            
            soup = BeautifulSoup(response.content, 'html.parser')
            results = []
            
            # Buscar resultados de jugadores
            player_rows = soup.find_all('tr', class_=['odd', 'even'])
            
            for row in player_rows[:5]:  # Limitar a 5 resultados
                try:
                    name_cell = row.find('td', class_='hauptlink')
                    if name_cell:
                        link = name_cell.find('a')
                        if link and link.has_attr('href'):
                            results.append({
                                'name': link.get_text(strip=True),
                                'url': self.base_url + link['href']
                            })
                except:
                    continue
            
            return results
            
        except Exception as e:
            logger.error(f"❌ Error buscando jugador: {e}")
            return []


def scrape_and_save_player(db: Session, transfermarkt_url: str) -> Optional[Player]:
    """
    Función helper para scrapear y guardar un jugador en la base de datos
    """
    scraper = TransfermarktScraper()
    player_data = scraper.scrape_transfermarkt_profile(transfermarkt_url)
    
    if not player_data:
        return None
    
    # Verificar si el jugador ya existe
    existing_player = db.query(Player).filter(
        Player.transfermarkt_url == transfermarkt_url
    ).first()
    
    if existing_player:
        # Actualizar datos
        for key, value in player_data.items():
            setattr(existing_player, key, value)
        db.commit()
        db.refresh(existing_player)
        return existing_player
    else:
        # Crear nuevo jugador
        new_player = Player(**player_data)
        db.add(new_player)
        db.commit()
        db.refresh(new_player)
        return new_player
