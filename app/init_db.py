from app.models import Base
from app.database import engine

def init_db():
    Base.metadata.create_all(bind=engine)
    print("✅ Database and tables created!")

if __name__ == "__main__":
    init_db()
