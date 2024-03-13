# python:3.12 image does not play nicely with cassandra-driver
FROM python:3.11

RUN apt update && \
    apt install -y zip && \
    apt clean

# Install dependencies for the main app
WORKDIR /code

COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the main app
COPY ./app/ /code/app
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
