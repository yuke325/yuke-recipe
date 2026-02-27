FROM ruby:3.4.3

RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
      build-essential \
      default-mysql-client \
      default-libmysqlclient-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000

CMD ["bin/rails", "server", "-b", "0.0.0.0"]
