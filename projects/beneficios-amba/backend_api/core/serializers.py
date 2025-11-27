from rest_framework import serializers
from .models import User, Shop, Offer, Transaction, SubscriptionPayment

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone', 'reputation_score', 'current_plan', 'subscription_end_date', 'is_subscription_active']

class ShopSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    is_visible = serializers.SerializerMethodField()
    
    class Meta:
        model = Shop
        fields = '__all__'
    
    def get_is_visible(self, obj):
        return obj.is_visible()

class SubscriptionPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SubscriptionPayment
        fields = '__all__'

class OfferSerializer(serializers.ModelSerializer):
    shop_name = serializers.CharField(source='shop.name', read_only=True)
    final_price = serializers.ReadOnlyField()

    class Meta:
        model = Offer
        fields = ['id', 'shop', 'shop_name', 'title', 'description', 'original_price', 'discount_percentage', 'final_price', 'image', 'active_until']

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
