install:
	npm install
	cd frontend && npm install

build:
	cd frontend && npx run build

start:
	npx start-server -s ./frontend/dist
