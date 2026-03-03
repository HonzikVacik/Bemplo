FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

# Expose the HTTP port
#ENV ASPNETCORE_URLS=http://+:8080
#EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Install Node.js + npm for the SPA build (bemplo.client.esproj runs `npm run build`)
RUN apt-get update \
    && apt-get install -y curl gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy entire repo
COPY . .

# Ensure frontend dependencies are installed for Linux (do not use host node_modules)
RUN rm -rf bemplo.client/node_modules \
    && cd bemplo.client \
    && npm ci

# Restore .NET dependencies
RUN dotnet restore "Bemplo.Server/Bemplo.Server.csproj"

# Build and publish the app
RUN dotnet publish "Bemplo.Server/Bemplo.Server.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "Bemplo.Server.dll"]


