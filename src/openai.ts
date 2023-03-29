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

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `以下をJSONに変換してください。

${input}

以下はJSONの定義です。

- name (文字列)
- workSchedules (配列)
    - employeeName
    - beginTime (HH:mm)
    - endTime (HH:mm)
    - days (月火水木金土日からなる配列)
`,
    temperature: 0,
    max_tokens: 512,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  const yen = (response.data.usage!.total_tokens / 1000) * 0.02 * 132;
  const jsonText = response.data.choices[0]
    .text!.replace(/```json/, "")
    .replace(/```/, "");

  return {
    yen,
    answer: JSON.parse(jsonText),
  };
}
