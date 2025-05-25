FROM maven:3.9.9-eclipse-temurin-21 AS build
COPY . .
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-alpine
COPY --from=build /target/*.jar iot.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "iot.jar"]