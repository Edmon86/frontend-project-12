install:
	npm ci
	cd frontend && npm ci

build:
	cd frontend && npm ci && npm run build

start:
	npx start-server -s ./frontend/dist

lint:
	cd frontend && npx eslint .
