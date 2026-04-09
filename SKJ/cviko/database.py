from sqlalchemy import create_engine

engine = create_engine('sqlite:///testdb.db', echo = True)