// バリデーション関数

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePhone = (phone: string): boolean => {
  // 日本の電話番号パターン（簡易版）
  const phoneRegex = /^[\d\-\(\)\+\s]{10,15}$/
  const cleanPhone = phone.replace(/\s/g, '')
  return phoneRegex.test(cleanPhone)
}

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export const validateRequired = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim() !== ''
}

export const validateMinLength = (value: string, minLength: number): boolean => {
  return Boolean(value && value.length >= minLength)
}

export const validateMaxLength = (value: string, maxLength: number): boolean => {
  return !value || value.length <= maxLength
}

export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

export const validateFutureDate = (dateString: string): boolean => {
  const date = new Date(dateString)
  const now = new Date()
  return date > now
}

// フォームバリデーションエラー型
export interface ValidationError {
  field: string
  message: string
}

// Account バリデーション
export const validateAccountForm = (data: {
  Name: string
  Type?: string
  Phone?: string
  Website?: string
  Email?: string
}): ValidationError[] => {
  const errors: ValidationError[] = []
  
  if (!validateRequired(data.Name)) {
    errors.push({ field: 'Name', message: '取引先名は必須です' })
  }
  
  if (data.Phone && !validatePhone(data.Phone)) {
    errors.push({ field: 'Phone', message: '有効な電話番号を入力してください' })
  }
  
  if (data.Website && !validateUrl(data.Website)) {
    errors.push({ field: 'Website', message: '有効なURLを入力してください' })
  }
  
  return errors
}

// Contact バリデーション
export const validateContactForm = (data: {
  FirstName?: string
  LastName: string
  Email?: string
  Phone?: string
  MobilePhone?: string
}): ValidationError[] => {
  const errors: ValidationError[] = []
  
  if (!validateRequired(data.LastName)) {
    errors.push({ field: 'LastName', message: '姓は必須です' })
  }
  
  if (data.Email && !validateEmail(data.Email)) {
    errors.push({ field: 'Email', message: '有効なメールアドレスを入力してください' })
  }
  
  if (data.Phone && !validatePhone(data.Phone)) {
    errors.push({ field: 'Phone', message: '有効な電話番号を入力してください' })
  }
  
  if (data.MobilePhone && !validatePhone(data.MobilePhone)) {
    errors.push({ field: 'MobilePhone', message: '有効な携帯電話番号を入力してください' })
  }
  
  return errors
}

// Opportunity バリデーション
export const validateOpportunityForm = (data: {
  Name: string
  StageName: string
  CloseDate: string
  Amount?: number
  Probability?: number
}): ValidationError[] => {
  const errors: ValidationError[] = []
  
  if (!validateRequired(data.Name)) {
    errors.push({ field: 'Name', message: '商談名は必須です' })
  }
  
  if (!validateRequired(data.StageName)) {
    errors.push({ field: 'StageName', message: 'ステージは必須です' })
  }
  
  if (!validateRequired(data.CloseDate)) {
    errors.push({ field: 'CloseDate', message: '完了予定日は必須です' })
  } else if (!validateDate(data.CloseDate)) {
    errors.push({ field: 'CloseDate', message: '有効な日付を入力してください' })
  }
  
  if (data.Amount !== undefined && data.Amount < 0) {
    errors.push({ field: 'Amount', message: '金額は0以上で入力してください' })
  }
  
  if (data.Probability !== undefined && (data.Probability < 0 || data.Probability > 100)) {
    errors.push({ field: 'Probability', message: '確度は0-100の範囲で入力してください' })
  }
  
  return errors
}