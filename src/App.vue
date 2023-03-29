<script setup lang="ts">
import { reactive, ref } from "vue";
import { Company, question, Result } from "./openai";

interface State {
  input: string;
  isLoading: boolean;
  result: Result | null;
}
const state = reactive<State>({
  input: "",
  isLoading: false,
  result: null,
});

const handleAICompletion = async () => {
  state.isLoading = true;
  state.result = await question(state.input);
  state.isLoading = false;
};

const DAYS_OPTIONS = [
  { label: "月", value: "月" },
  { label: "火", value: "火" },
  { label: "水", value: "水" },
  { label: "木", value: "木" },
  { label: "金", value: "金" },
  { label: "土", value: "土" },
  { label: "日", value: "日" },
];
</script>

<template>
  <n-space vertical>
    <n-input
      v-model:value="state.input"
      size="large"
      round
      placeholder="シフト情報を記載する"
      type="textarea"
      style="width: 800px; height: 180px; text-align: left"
    />

    <n-button :loading="state.isLoading" type="info" @click="handleAICompletion"
      >AI completion</n-button
    >

    <div v-if="state.result">
      <n-alert title="OpenAI APIの利用料金" type="info">
        {{ state.result.yen }}円 (1ドル=132円換算)
      </n-alert>

      <n-divider>AIによる解析結果を自動で挿入</n-divider>

      <n-form
        :label-width="80"
        :model="state.result.answer"
        style="text-align: left"
      >
        <n-form-item label="会社名">
          <n-input v-model:value="state.result.answer.name" />
        </n-form-item>

        <n-space>
          <template v-for="ws in state.result.answer.workSchedules">
            <n-card :title="ws.employeeName">
              <n-space>
                <n-form-item label="出勤時間">
                  <n-time-picker
                    v-model:formatted-value="ws.beginTime"
                    value-format="HH:mm"
                    format="HH:mm"
                  />
                </n-form-item>
                <n-form-item label="退勤時間">
                  <n-time-picker
                    v-model:formatted-value="ws.endTime"
                    value-format="HH:mm"
                    format="HH:mm"
                  />
                </n-form-item>
              </n-space>
              <n-form-item label="出勤曜日">
                <n-select
                  v-model:value="ws.days"
                  multiple
                  :options="DAYS_OPTIONS"
                />
              </n-form-item>
            </n-card>
          </template>
        </n-space>

        <n-form-item
          style="display: flex; justify-content: center; margin-top: 30px"
        >
          <n-button type="primary" style="width: 200px"> 投稿 </n-button>
        </n-form-item>
      </n-form>
    </div>
  </n-space>
</template>

<style scoped></style>
