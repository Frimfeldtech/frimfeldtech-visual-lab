from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import timedelta

# 1. USUARIO Y GESTIÓN DE SUSCRIPCIONES
class User(AbstractUser):
    ROLES = (
        ('CLIENT', 'Cliente'),
        ('OWNER', 'Dueño de Local'),
        ('ADMIN', 'Administrador'),
    )
    role = models.CharField(max_length=10, choices=ROLES, default='CLIENT')
    phone = models.CharField(max_length=20, blank=True)
    reputation_score = models.FloatField(default=5.0) # Mantenemos gamificación anterior
    
    # Lógica de Suscripción (Solo para dueños)
    PLAN_CHOICES = (
        ('MONTHLY', 'Mensual'),
        ('QUARTERLY', 'Trimestral'),
        ('ANNUAL', 'Anual')
    )
    current_plan = models.CharField(max_length=10, choices=PLAN_CHOICES, blank=True, null=True)
    subscription_end_date = models.DateTimeField(null=True, blank=True)
    is_subscription_active = models.BooleanField(default=False)

    def activate_subscription(self, plan_type):
        """Ingeniería: Sumar tiempo basado en el plan elegido"""
        days = 30 if plan_type == 'MONTHLY' else 90 if plan_type == 'QUARTERLY' else 365
        self.current_plan = plan_type
        # Si ya tiene fecha futura, sumamos. Si no, empezamos desde hoy.
        start_date = self.subscription_end_date if (self.subscription_end_date and self.subscription_end_date > timezone.now()) else timezone.now()
        self.subscription_end_date = start_date + timedelta(days=days)
        self.is_subscription_active = True
        self.save()

# 2. EL NEGOCIO (LOCAL) - Optimizado para OSM
class Shop(models.Model):
    CATEGORIES = (
        ('KIOSCO', 'Kiosco'),
        ('PYME', 'PyME'),
        ('CLOTHING', 'Indumentaria'),
        ('FOOD', 'Gastronomía'),
        ('SERVICES', 'Servicios'),
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shops')
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORIES, default='PYME') # Mantenemos categoría
    address_text = models.CharField(max_length=200, blank=True) # Dirección para Nominatim
    # Coordenadas para OpenStreetMap
    latitude = models.FloatField(default=0.0) 
    longitude = models.FloatField(default=0.0)
    is_verified = models.BooleanField(default=False) # Mantenemos verificado
    
    def is_visible(self):
        """Regla de Negocio: El local solo se muestra si el dueño pagó"""
        return self.owner.is_subscription_active and self.owner.subscription_end_date > timezone.now()

    def __str__(self):
        return f"{self.name} ({self.category})"

# 3. COMPROBANTE DE PAGO DE SUSCRIPCIÓN (Para control manual)
class SubscriptionPayment(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    proof_image = models.ImageField(upload_to='sub_proofs/') # Foto del comprobante
    plan_selected = models.CharField(max_length=10, choices=User.PLAN_CHOICES)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def approve(self):
        """El Admin aprueba el comprobante y el sistema activa el plan"""
        self.is_verified = True
        self.owner.activate_subscription(self.plan_selected)
        self.save()

# 4. OFERTAS Y BENEFICIOS (Mantenido)
class Offer(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='offers')
    title = models.CharField(max_length=100)
    description = models.TextField()
    original_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.IntegerField(help_text="Porcentaje de descuento (ej: 20)")
    image = models.ImageField(upload_to='offers/')
    active_until = models.DateTimeField()
    
    @property
    def final_price(self):
        return self.original_price * (1 - (self.discount_percentage / 100))

# 5. TRANSACCIÓN (Mantenido)
class Transaction(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pendiente de Validación'),
        ('APPROVED', 'Aprobado'),
        ('REJECTED', 'Rechazado'),
    )
    customer = models.ForeignKey(User, on_delete=models.PROTECT)
    offer = models.ForeignKey(Offer, on_delete=models.PROTECT)
    payment_proof = models.ImageField(upload_to='proofs/', blank=True, null=True) # Foto del comprobante
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

    def approve_transaction(self):
        # Lógica para sumar puntos de fidelidad al cliente
        self.status = 'APPROVED'
        self.customer.reputation_score += 0.1 # Gamificación
        self.customer.save()
        self.save()
