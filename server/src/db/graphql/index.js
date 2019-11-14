import graphqlHTTP from "express-graphql"
import { schema } from "./schema"
import { root as rootValue } from "./resolver"

export default graphqlHTTP({
	schema,
	rootValue,
	graphiql: process.env.NODE_ENV === "development",
})
