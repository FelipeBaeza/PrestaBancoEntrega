FROM openjdk:17
ARG JAR_FILE=target/*.jar
COPY ${JAR_FILE} prestaB-backend.jar
EXPOSE 8090

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "prestaB-backend.jar"]

