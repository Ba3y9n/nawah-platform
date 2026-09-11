'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function mapAuthError(errorMsg: string): string {
  const msg = errorMsg.toLowerCase()
  if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
    return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
  }
  if (msg.includes('email not confirmed')) {
    return 'لم يتم تأكيد البريد الإلكتروني بعد. يرجى مراجعة بريدك الإلكتروني وتأكيده أولاً.'
  }
  if (msg.includes('already registered') || msg.includes('user with this email already exists') || msg.includes('email already in use')) {
    return 'هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد آخر.'
  }
  if (msg.includes('password should be at least') || msg.includes('weak password')) {
    return 'كلمة المرور ضعيفة. يجب ألا تقل عن 6 أحرف.'
  }
  if (msg.includes('invalid email') || msg.includes('unable to validate email')) {
    return 'يرجى إدخال بريد إلكتروني صحيح.'
  }
  if (msg.includes('rate limit') || msg.includes('too many requests')) {
    return 'تم تجاوز عدد المحاولات المسموح بها، يرجى الانتظار قليلاً ثم المحاولة مرة أخرى.'
  }
  return 'حدث خطأ أثناء تنفيذ الطلب. يرجى التأكد من البيانات والمحاولة مجدداً.'
}

export async function loginAction(formData: FormData) {
  const email = (formData.get('email') as string || '').trim()
  const password = (formData.get('password') as string || '').trim()

  if (!email || !password) {
    return { error: 'يرجى إدخال البريد الإلكتروني وكلمة المرور.' }
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: mapAuthError(error.message) }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function signupAction(formData: FormData) {
  const name = (formData.get('name') as string || '').trim()
  const email = (formData.get('email') as string || '').trim()
  const password = (formData.get('password') as string || '').trim()
  const confirmPassword = (formData.get('confirmPassword') as string || '').trim()
  const userType = (formData.get('user_type') as string || 'individual').trim()
  const organization = (formData.get('organization') as string || '').trim()
  const regionId = (formData.get('region_id') as string || '').trim()
  const cityId = (formData.get('city_id') as string || '').trim()

  if (!name || !email || !password) {
    return { error: 'يرجى تعبئة الحقول المطلوبة (الاسم الكامل، البريد الإلكتروني، كلمة المرور).' }
  }

  if (password !== confirmPassword) {
    return { error: 'كلمات المرور غير متطابقة.' }
  }

  if (password.length < 6) {
    return { error: 'كلمة المرور يجب ألا تقل عن 6 أحرف.' }
  }

  const supabase = await createClient()

  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        user_type: userType,
        organization,
        region_id: regionId,
        city_id: cityId,
      }
    }
  })

  if (error) {
    return { error: mapAuthError(error.message) }
  }

  // Also manually ensure profiles row exists in case Postgres trigger is delayed or not applied
  if (authData.user) {
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: authData.user.id,
      full_name: name,
      email: email,
      user_type: userType,
      organization: organization || null,
      region_id: regionId || null,
      city_id: cityId || null,
    })
    if (profileError) {
      console.warn('Manual profile upsert notice:', profileError.message)
    }
  }

  revalidatePath('/', 'layout')

  // If email confirmation is enabled in Supabase, session will be null
  if (!authData.session) {
    return { 
      info: 'تم إنشاء حسابك بنجاح! إذا كان خيار تأكيد البريد مفعلاً في مشروعك، يرجى مراجعة بريدك الإلكتروني لتنشيط الحساب ثم تسجيل الدخول.' 
    }
  }

  return { success: true }
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
