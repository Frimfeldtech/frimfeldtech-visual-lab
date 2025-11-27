from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ShopViewSet, OfferViewSet, TransactionViewSet, SubscriptionPaymentViewSet

router = DefaultRouter()
router.register(r'shops', ShopViewSet)
router.register(r'offers', OfferViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'payments', SubscriptionPaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
