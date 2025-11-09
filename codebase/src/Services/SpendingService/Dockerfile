FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["Services/SpendingService/CustomerSpendingDashboard.Services.Spending.csproj", "Services/SpendingService/"]
RUN dotnet restore "Services/SpendingService/CustomerSpendingDashboard.Services.Spending.csproj"
COPY . .
WORKDIR "/src/Services/SpendingService"
RUN dotnet build "CustomerSpendingDashboard.Services.Spending.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "CustomerSpendingDashboard.Services.Spending.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "CustomerSpendingDashboard.Services.Spending.dll"]

