const { ApolloServer } = require("apollo-server");
const { db } = require("./db");

const typeDefs = `#graphql
  type Query {
    hello: String
    products(filter: ProductsFilterInput): [Product!]!
    product(id: ID!): Product
    categories: [Category!]!
    category(id: ID!): Category
  }
  type Product {
    id: ID!
    name: String!
    description: String!
    quantity: Int!
    price: Float!
    onSale: Boolean!
    image: String!
    category: Category
    reviews: [Review!]!
  }
  type Category {
    id: ID!
    name: String!
    products(filter: ProductsFilterInput): [Product!]!
  }
  type Review{
    id: ID!
    date: String!
    title: String!
    comment: String!
    rating: Int!
  }
  input ProductsFilterInput{
    onSale: Boolean
    avgRating: Int
  }
`;

const resolvers = {
  Query: {
    hello: (_) => `Hello World!`,
    categories: (_) => db.categories,
    category: (_, { id }) =>
      db.categories.find((category) => category.id === id),
    product: (_, { id }) => db.products.find((product) => product.id === id),
    products: (_) => db.products,
  },
};

it("returns hello with the provided name", async () => {
  const testServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const response = await testServer.executeOperation({
    query: "query SayHelloWorld { hello  }",
  });
  expect(response.data?.hello).toBe("Hello World!");
});

it("returns categories with the name ", async () => {
  const testServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const response = await testServer.executeOperation({
    query: "query SayHelloWorld{ categories{name} }",
  });
  const expectedResponse = [
    {
      name: "Kitchen",
    },
    {
      name: "Garden",
    },
    {
      name: "Sports",
    },
  ];
  expect(response.data?.categories).toEqual(expectedResponse);
});

it("returns user with the categoryId ", async () => {
  const testServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const response = await testServer.executeOperation({
    query: "query SayHelloWorld($id: ID!){ category(id: $id){id} }",
    variables: { id: "d914aec0-25b2-4103-9ed8-225d39018d1d" },
  });
  const expectedResponse = { id: "d914aec0-25b2-4103-9ed8-225d39018d1d" };
  console.log(response);
  expect(response.data?.category).toEqual(expectedResponse);
});

it("returns product with the productId ", async () => {
  const testServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const response = await testServer.executeOperation({
    query: "query SayHelloWorld($id: ID!){ product(id: $id){id} }",
    variables: { id: "404daf2a-9b97-4b99-b9af-614d07f818d7" },
  });
  const expectedResponse = { id: "404daf2a-9b97-4b99-b9af-614d07f818d7" };
  console.log(response);
  expect(response.data?.product).toEqual(expectedResponse);
});

it("returns products with the name ", async () => {
  const testServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const response = await testServer.executeOperation({
    query: "query SayHelloWorld{ products{name} }",
  });
  const expectedResponse = [
    {
      name: "Steel Pot",
    },
    {
      name: "Salad Bowl",
    },
    {
      name: "Spoon",
    },
    {
      name: "Shovel",
    },
    {
      name: "Fertilizer",
    },
    {
      name: "Basketball",
    },
    {
      name: "Golf Clubs",
    },
    {
      name: "Baseball Gloves",
    },
    {
      name: "Soccer Ball",
    },
  ];
  expect(response.data?.products).toEqual(expectedResponse);
});
