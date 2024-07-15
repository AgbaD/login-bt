import { useState } from "react";

export default function useRequest(request: any, defaultPayload?: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [[response, error], setResponseAndError] = useState<any[]>([null, null]);

  async function makeRequest(payload = defaultPayload) {
    setIsLoading(true);
    setResponseAndError([null, null])

    const responseAndError = await request(payload);
    setResponseAndError(responseAndError);
    setIsLoading(false);

    return responseAndError
  }

  return {
    makeRequest,
    isLoading,
    response,
    error,
  };
}