import apiConfig from "@/configs/api.config";

export const chatAiService = {
  // GraphQL wrapper for chat AI - returns the { raw, text } shape (as your backend provides)
  chatAi: async (text: string) => {
    const response = await apiConfig.post('', {
      query: `
        query ChatAi($text: String!) {
          chatAi(text: $text) {
            raw
            text
          }
        }
      `,
      variables: { text },
    });
    return response.data?.data?.chatAi ?? null;
  },

  // NL to SQL - return rows array (your backend returns rows)
  NLtoSQL: async (text: string) => {
    const response = await apiConfig.post('', {
      query: `
        query Query($text: String!) {
          queryNLtoSQL(text: $text) {
            raw
            rows
            spec
          }
        }
      `,
      variables: { text },
    });
    // prefer returning the full object if you want spec/raw too; here we return rows for backward compatibility
    return response.data?.data?.queryNLtoSQL?.rows ?? [];
  },
};
