from django.test import TestCase
from .models import Offer


class OfferModelTest(TestCase):
    def test_str_representation(self):
        offer = Offer(title="Offre Test", description="desc", price=99.99)
        self.assertEqual(str(offer), "Offre Test")
