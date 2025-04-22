FROM golang:1.24.2

WORKDIR /app

COPY go.mod go.sum /app/
RUN go mod download

COPY . .
RUN go build -o /usr/local/bin/backend

CMD [ "backend" ]