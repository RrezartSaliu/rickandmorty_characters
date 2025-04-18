import { DocumentNode, gql } from "@apollo/client";

export const getCharactersQuery = (): DocumentNode => gql`
  query Characters($page: Int) {
    characters(page: $page) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        gender
        origin {
          name
        }
      }
    }
  }
`;