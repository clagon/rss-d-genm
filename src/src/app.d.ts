// src/app.d.ts

import { SupabaseClient, Session, User } from '@supabase/supabase-js'

declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient
			safeGetSession(): Promise<{ session: Session | null; user: User | null }>

			session: Session | null
			user: User | null
		}
		interface PageData {
			supabase: SupabaseClient
			session: Session | null
			user: User | null
		}
		// interface Error {}
		// interface Platform {}
	}
}