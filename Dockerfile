FROM maven AS appbuilder

WORKDIR /build

COPY . .

RUN mvn clean package -DskipTests

FROM eclipse-temurin:25-jre-ubi10-minimal

WORKDIR /app

RUN microdnf -y update && microdnf -y install curl && \
    groupadd -g 1001 app && \
    useradd --no-create-home -u 1001 -g 1001 app && \
    chown -R app:app /app

COPY --from=appbuilder build/target/*.jar app.jar

EXPOSE 8080

USER app

ENTRYPOINT ["java", "-jar", "app.jar"]
CMD []