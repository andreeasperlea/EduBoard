from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "EduBoard Backend"

    # MongoDB
    MONGO_URI: str = "mongodb://admin:secret@localhost:27017/"
    MONGO_DB_NAME: str = "eduboard"

    # JWT
    SECRET_KEY: str = "CHANGE_ME"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    class Config:
        env_file = ".env"

settings = Settings()
