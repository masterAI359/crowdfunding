import toast from 'react-hot-toast'

/**
 * バックエンドのエラーメッセージを日本語に翻訳
 */
export function translateErrorMessage(message: string): string {
  // バリデーションエラーの翻訳
  const translations: { [key: string]: string } = {
    'goalAmount must not be less than 1': '目標金額は1以上である必要があります',
    'goalAmount must be an integer number': '目標金額は整数である必要があります',
    'goalAmount should not be empty': '目標金額を入力してください',
    'title should not be empty': 'タイトルを入力してください',
    'endDate must be a valid ISO 8601 date string': '終了日は有効な日付である必要があります',
    'endDate should not be empty': '終了日を入力してください',
  }

  // 完全一致をチェック
  if (translations[message]) {
    return translations[message]
  }

  // 部分一致をチェック（エラーメッセージに含まれる場合）
  for (const [key, value] of Object.entries(translations)) {
    if (message.includes(key)) {
      return value
    }
  }

  // 翻訳が見つからない場合は元のメッセージを返す
  return message
}

/**
 * エラーメッセージを表示（日本語化）
 */
export function showError(message: string) {
  const translatedMessage = translateErrorMessage(message)
  toast.error(translatedMessage)
}

/**
 * 成功メッセージを表示
 */
export function showSuccess(message: string) {
  toast.success(message)
}

/**
 * 情報メッセージを表示
 */
export function showInfo(message: string) {
  toast(message, {
    icon: 'ℹ️',
  })
}

/**
 * APIエラーを処理して表示
 */
export function handleApiError(error: any): string {
  let errorMessage = 'エラーが発生しました'

  if (error?.response?.data?.message) {
    errorMessage = error.response.data.message
  } else if (error?.response?.data?.error) {
    errorMessage = error.response.data.error
  } else if (error?.message) {
    errorMessage = error.message
  }

  // バリデーションエラーの配列の場合
  if (Array.isArray(error?.response?.data?.message)) {
    const translatedMessages = error.response.data.message.map((msg: string) =>
      translateErrorMessage(msg)
    )
    errorMessage = translatedMessages.join(', ')
  } else {
    errorMessage = translateErrorMessage(errorMessage)
  }

  showError(errorMessage)
  return errorMessage
}

