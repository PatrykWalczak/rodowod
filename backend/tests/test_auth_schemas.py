import pytest
from pydantic import ValidationError

from app.schemas.auth import RegisterRequest


def test_register_valid():
    """Valid registration data should pass validation."""
    data = RegisterRequest(
        email="jan@example.com",
        password="haslo1234",
        first_name="Jan",
        last_name="Kowalski",
    )
    assert data.email == "jan@example.com"
    assert data.first_name == "Jan"


def test_register_invalid_email():
    """Invalid email should raise ValidationError."""
    with pytest.raises(ValidationError):
        RegisterRequest(
            email="to-nie-jest-email",
            password="haslo1234",
            first_name="Jan",
            last_name="Kowalski",
        )


def test_register_password_too_short():
    """Password shorter than 8 characters should raise ValidationError."""
    with pytest.raises(ValidationError):
        RegisterRequest(
            email="jan@example.com",
            password="abc",
            first_name="Jan",
            last_name="Kowalski",
        )


def test_register_empty_first_name():
    """Empty first name should raise ValidationError."""
    with pytest.raises(ValidationError):
        RegisterRequest(
            email="jan@example.com",
            password="haslo1234",
            first_name="   ",
            last_name="Kowalski",
        )
