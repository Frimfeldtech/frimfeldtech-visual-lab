import os
import django
import random
from datetime import timedelta
from django.utils import timezone

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'beneficios_amba.settings')
django.setup()

from core.models import User, Shop, Offer

def populate():
    print("🚀 Iniciando carga de datos de prueba...")

    # 1. Crear Usuarios Dueños
    owners = []
    for i in range(5):
        username = f'owner_{i}'
        if not User.objects.filter(username=username).exists():
            user = User.objects.create_user(
                username=username,
                email=f'{username}@example.com',
                password='password123',
                role='OWNER',
                is_subscription_active=True,
                subscription_end_date=timezone.now() + timedelta(days=365)
            )
            owners.append(user)
            print(f"✅ Usuario creado: {username}")
        else:
            owners.append(User.objects.get(username=username))

    # 2. Crear Comercios (Ubicaciones reales en CABA/AMBA)
    locations = [
        {"name": "Kiosco El Obelisco", "lat": -34.6037, "lng": -58.3816, "cat": "KIOSCO"},
        {"name": "Pizzería Güerrín", "lat": -34.6040, "lng": -58.3860, "cat": "FOOD"},
        {"name": "Ropa Avellaneda", "lat": -34.6300, "lng": -58.4700, "cat": "CLOTHING"},
        {"name": "Ferretería Palermo", "lat": -34.5800, "lng": -58.4200, "cat": "PYME"},
        {"name": "Tech Service Belgrano", "lat": -34.5600, "lng": -58.4500, "cat": "SERVICES"},
    ]

    shops = []
    for i, loc in enumerate(locations):
        owner = owners[i % len(owners)]
        shop, created = Shop.objects.get_or_create(
            name=loc["name"],
            defaults={
                "owner": owner,
                "category": loc["cat"],
                "latitude": loc["lat"],
                "longitude": loc["lng"],
                "address_text": "Dirección de prueba 123",
                "is_verified": True
            }
        )
        shops.append(shop)
        if created:
            print(f"✅ Comercio creado: {shop.name}")

    # 3. Crear Ofertas
    offer_titles = ["20% OFF en Efectivo", "2x1 en Productos", "Descuento Especial", "Promo Lanzamiento"]
    
    for shop in shops:
        if not shop.offers.exists():
            Offer.objects.create(
                shop=shop,
                title=random.choice(offer_titles),
                description="Aprovecha esta increíble oferta válida por tiempo limitado.",
                original_price=random.randint(1000, 10000),
                discount_percentage=random.choice([10, 20, 30, 50]),
                active_until=timezone.now() + timedelta(days=30)
            )
            print(f"✅ Oferta creada para: {shop.name}")

    print("\n🎉 ¡Datos cargados exitosamente!")

if __name__ == '__main__':
    populate()
