export default async function createRequest(
    url: string,
    method: "get" | "post" | "put" | "patch" | "delete",
    body?: Record<string, any>
  ) {
    try {
      const headers: any = {
        "Content-Type": "application/json",
      };
  
      const res = await fetch(`https://google.com${url}`, {
        method,
        headers,
        body: JSON.stringify(body),
      });
      let response;
      try {
        response = await res.json();
      } catch {
        return [null, { message: "Something went wrong" }];
      }
  
      if (!res.ok) {
        return [null, response];
      }
      return [response, null];
    } catch (err) {
      return [null, err];
    }
  }