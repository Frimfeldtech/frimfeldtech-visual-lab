from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Shop, Offer, Transaction, SubscriptionPayment

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'role', 'is_subscription_active', 'subscription_end_date', 'reputation_score')
    list_filter = ('role', 'is_subscription_active', 'current_plan')
    fieldsets = UserAdmin.fieldsets + (
        ('Información Adicional', {'fields': ('role', 'phone', 'reputation_score')}),
        ('Suscripción', {'fields': ('current_plan', 'subscription_end_date', 'is_subscription_active')}),
    )

@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'owner', 'is_visible', 'is_verified')
    list_filter = ('category', 'is_verified')
    search_fields = ('name', 'owner__username', 'address_text')

@admin.register(SubscriptionPayment)
class SubscriptionPaymentAdmin(admin.ModelAdmin):
    list_display = ('owner', 'plan_selected', 'amount', 'is_verified', 'created_at')
    list_filter = ('is_verified', 'plan_selected')
    actions = ['approve_payments']

    def approve_payments(self, request, queryset):
        for payment in queryset:
            payment.approve()
    approve_payments.short_description = "Aprobar pagos seleccionados"

@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = ('title', 'shop', 'original_price', 'discount_percentage', 'final_price_display', 'active_until')
    list_filter = ('shop', 'active_until')
    search_fields = ('title', 'shop__name')

    def final_price_display(self, obj):
        return f"${obj.final_price:.2f}"
    final_price_display.short_description = 'Precio Final'

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('customer', 'offer', 'status', 'created_at')
    list_filter = ('status', 'created_at')
    actions = ['approve_transactions']

    def approve_transactions(self, request, queryset):
        for transaction in queryset:
            transaction.approve_transaction()
    approve_transactions.short_description = "Aprobar transacciones seleccionadas"
