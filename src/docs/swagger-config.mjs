import swaggerAutogen from "swagger-autogen";
import dotenv from "dotenv";
dotenv.config();

const doc = {
  info: {
    title: "API Danielbot",
  },
  host: process.env.HOST || "localhost:3000",
  basePath: "/api/v1",
  schemes: process.env.HOST ? "https" : "http",
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    {
      name: "Enterprise",
      description: "/enterprises/",
    },
    {
      name: "Profile",
      description: "/profiles/",
    },
    {
      name: "Client",
      description: "/clients/",
    },
    {
      name: "Message",
      description: "/messages/",
    },
    {
      name: "Flow",
      description: "/flows/",
    },
    {
      name: "PricingPlans",
      description: "/plans/",
    },
    {
      name: "Generic",
      description: "Rutas genéricas",
    },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
      description: "🆘 Poner el prefijo 'Bearer'. Ej: Bearer 1cabj",
    },
  },
  definitions: {
    Enterprises: {
      name: "Enterprise name",
      phone: 2612140198,
      connected: false,
    },
    Profiles: {
      username: "Pepe Argento",
      password: "contraseña",
      email: "example@example.com",
      role: {
        "@enum": ["admin", "redactor", "empleado"],
      },
    },
    ProfileResponse: {
      id: "string",
      email: "string",
      token: "string",
    },
    Clients: {
      username: "Pepe Argento",
      phone: 2612140198,
    },
    Messages: {
      body: "Hola, cómo estás?",
      flow: "5ba7f8bf-544e-4d95-8b8b-aaeaef427d6e",
      numOrder: 2,
    },
    Flows: {
      name: "Flow inicial",
      description: "flow de bienvenida con dos mensajes",
      pricingPlans: [
        "5ba7f8bf-544e-4d95-8b8b-aaeaef427d6e",
        "5ba7f8bf-544e-4d95-8b8b-aaeaef427d6e",
      ],
    },
    PricingPlans: {
      name: "Free",
      description: "Free plan $0",
      price: 0,
    },
    SignUp: {
      email: "example@gmail.com",
      phone: 26121164,
      password: "example",
      name: "Enterprise name",
      username: "Pepe",
    },
    SignIn: {
      email: "example@gmail.com",
      password: "example",
    },
    Authenticated: {
      token: "fwfowfkr302490...",
    },
    EnterprisesUpdate: {
      phone: 26121164,
      name: "Enterprise name",
      pricingPlan: "4a7cd21b-6a89-4bb1-8c47-e90a2ba1907a",
      connected: true,
    },
    Generics: {
      Enterprises: {
        name: "Enterprise name",
        phone: 2612140198,
        connected: false,
      },
      Clients: {
        username: "Pepe Argento",
        phone: 2612140198,
      },
      Messages: {
        body: "Hola, cómo estás?",
        numOrder: 2,
      },
      PricingPlans: {
        name: "Free",
        description: "Free plan $0",
        price: 0,
      },
    },
  },
};

const outputFile = "./swagger-output.json";
const routes = ["../routes/*.route.ts", "../types/routeGenerics"];

swaggerAutogen(outputFile, routes, doc, {
  customSiteTitle: 'Backend Generator',
      customfavIcon: 'https://avatars.githubusercontent.com/u/185267919?s=400&u=7d74f9c123b27391d3f11da2815de1e9a1031ca9&v=4',
      customJs: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
      ],
      customCssUrl: [
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css',
      ],
});
