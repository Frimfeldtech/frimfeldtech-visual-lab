import requests
import time
import sys

API_URL = "http://127.0.0.1:8000/api/"

print("⏳ Esperando a que el servidor inicie...")
time.sleep(5) # Dar tiempo a Django para arrancar

try:
    # 1. Verificar estado general de la API
    print(f"🔄 Conectando a {API_URL}...")
    response = requests.get(API_URL)
    
    if response.status_code == 200:
        print("✅ ¡API Online! Respuesta del servidor:")
        print(response.json())
    else:
        print(f"❌ Error: Status {response.status_code}")
        sys.exit(1)

    # 2. Verificar endpoint de Comercios
    shops_url = f"{API_URL}shops/"
    print(f"\n🔄 Consultando comercios en {shops_url}...")
    shops_response = requests.get(shops_url)
    
    if shops_response.status_code == 200:
        print(f"✅ Endpoint de Comercios activo. Cantidad encontrada: {len(shops_response.json())}")
    else:
        print(f"⚠️ Alerta: El endpoint de comercios devolvió {shops_response.status_code}")

except requests.exceptions.ConnectionError:
    print("❌ No se pudo conectar al servidor. Asegúrate de que 'python manage.py runserver' esté corriendo.")
except Exception as e:
    print(f"❌ Ocurrió un error inesperado: {e}")
