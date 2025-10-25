# Makefile для проекта с frontend на Vite и сервером

# Установка зависимостей
install:
	cd frontend && npm install
	npm install

# Сборка фронтенда
build:
	cd frontend && npm install && npx vite build

# Запуск сервера с отдачей фронтенда
start:
	npx start-server -s ./frontend/dist
