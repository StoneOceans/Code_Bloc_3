import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

class CNILPasswordValidator:


    def __init__(self, min_length=12):
        self.min_length = min_length

    def validate(self, password, user=None):
        if user is not None:
            username = getattr(user, 'username', None)
            email = getattr(user, 'email', None)
            for attr in (username, email):
                if attr and attr.lower() in password.lower():
                    raise ValidationError(
                        _("Votre mot de passe ne doit pas contenir votre nom d’utilisateur ou votre email."),
                        code='password_personal_info',
                    )

        if len(password) < self.min_length:
            raise ValidationError(
                _("Votre mot de passe doit contenir au moins %(min_length)d caractères."),
                code='password_too_short',
                params={'min_length': self.min_length},
            )

        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                _("Votre mot de passe doit contenir au moins une lettre majuscule."),
                code='password_no_upper',
            )
        if not re.search(r'[a-z]', password):
            raise ValidationError(
                _("Votre mot de passe doit contenir au moins une lettre minuscule."),
                code='password_no_lower',
            )
        if not re.search(r'\d', password):
            raise ValidationError(
                _("Votre mot de passe doit contenir au moins un chiffre."),
                code='password_no_digit',
            )
        if not re.search(r'[^A-Za-z0-9]', password):
            raise ValidationError(
                _("Votre mot de passe doit contenir au moins un caractère spécial (ponctuation, symbole, …)."),
                code='password_no_special',
            )

    def get_help_text(self):
        return _(
            "Votre mot de passe doit :\n"
            " • faire au moins %(min_length)d caractères ;\n"
            " • contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial ;\n"
            " • ne pas contenir votre nom d’utilisateur ni votre adresse email."
        ) % {'min_length': self.min_length}
