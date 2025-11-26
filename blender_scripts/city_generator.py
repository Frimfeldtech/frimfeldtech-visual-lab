# blender_scripts/city_generator.py
# Script de automatización para generar entornos Sci-Fi
import bpy
import random

def create_procedural_building(height, width):
    """Genera un edificio con geometría variable basada en parámetros."""
    bpy.ops.mesh.primitive_cube_add(size=2, location=(0, 0, height/2))
    obj = bpy.context.active_object
    obj.scale = (width, width, height)
    
    # Lógica de generación de materiales procedurales (Neon/Dark Style)
    mat = bpy.data.materials.new(name="NeonGlass")
    mat.use_nodes = True
    # ... configuración de nodos ...
    
    print(f"Edificio generado: {height}m x {width}m")

# Ejecutar generador
create_procedural_building(random.randint(10, 50), random.randint(2, 5))
