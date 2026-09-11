'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' }
  }

  revalidatePath('/', 'layout')
  redirect('/pit-management/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('name') as string,
        user_type: formData.get('user_type') as string,
        organization: formData.get('organization') as string,
        region_id: formData.get('region_id') as string,
        city_id: formData.get('city_id') as string,
      }
    }
  }

  const { error, data: authData } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }
  
  // Create profile
  if (authData.user) {
     await supabase.from('profiles').insert({
       id: authData.user.id,
       full_name: data.options.data.full_name,
       user_type: data.options.data.user_type,
       organization: data.options.data.organization,
       region_id: data.options.data.region_id,
       city_id: data.options.data.city_id,
     })
  }

  revalidatePath('/', 'layout')
  redirect('/pit-management/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}
