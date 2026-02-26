# Import all models here so SQLAlchemy can resolve relationships
# regardless of which model is imported first elsewhere in the app
from app.models.breed import Breed  # noqa: F401
from app.models.dog import Dog  # noqa: F401
from app.models.user import User  # noqa: F401
