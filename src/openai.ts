import { Configuration, OpenAIApi } from "openai";

export interface Result {
  yen: number;
  answer: Company;
}

export interface Company {
  name: string;
  workSchedules: WorkSchedule[];
}

export interface WorkSchedule {
  employeeName: string;
  beginTime: string;
  endTime: string;
  days: string[];
}

export async function question(input: string): Promise<Result> {
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `結果のJSONだけを回答してください。解説や注意は不要です。

以下をJSONに変換してください。

----
${input}
----

以下はJSONの定義です。他のプロパティは存在しません。

- name (会社名)
- workSchedules (配列)
    - employeeName (従業員名)
    - beginTime (例: 03:00)
    - endTime (例: 19:00)
    - days (月火水木金土日からなる配列)
`,
      },
    ],
    temperature: 0,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  console.log(response.data);
  const yen = (response.data.usage!.total_tokens / 1000) * 0.002 * 132;
  const jsonText = response.data.choices[0].message?.content!;

  return {
    yen,
    answer: JSON.parse(jsonText),
  };
}
