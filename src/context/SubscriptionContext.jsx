import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase'

const SubscriptionContext = createContext({
    subscriptionStatus: 'free',
    subscriptionPlan: null,
    subscriptionEndsAt: null,
    customerPortalUrl: null,
    isPro: false,
    loading: true,
    refresh: () => {}
})

export function SubscriptionProvider({ children }) {
    const [subscriptionStatus, setSubscriptionStatus] = useState('free')
    const [subscriptionPlan, setSubscriptionPlan] = useState(null)
    const [subscriptionEndsAt, setSubscriptionEndsAt] = useState(null)
    const [customerPortalUrl, setCustomerPortalUrl] = useState(null)
    const [loading, setLoading] = useState(true)

    async function fetchProfile() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setSubscriptionStatus('free')
            setSubscriptionPlan(null)
            setSubscriptionEndsAt(null)
            setCustomerPortalUrl(null)
            setLoading(false)
            return
        }
        const { data, error } = await supabase
            .from('profiles')
            .select('subscription_status, subscription_plan, subscription_ends_at, customer_portal_url')
            .eq('id', user.id)
            .single()

        if (!error && data) {
            setSubscriptionStatus(data.subscription_status ?? 'free')
            setSubscriptionPlan(data.subscription_plan ?? null)
            setSubscriptionEndsAt(data.subscription_ends_at ?? null)
            setCustomerPortalUrl(data.customer_portal_url ?? null)
        } else {
            setSubscriptionStatus('free')
            setSubscriptionPlan(null)
            setSubscriptionEndsAt(null)
            setCustomerPortalUrl(null)
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchProfile()
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
                fetchProfile()
            }
        })
        return () => subscription.unsubscribe()
    }, [])

    // Pro if active, OR if cancelled but still within the paid period
    const isPro = subscriptionStatus === 'active' ||
        (subscriptionEndsAt !== null && new Date(subscriptionEndsAt) > new Date())

    return (
        <SubscriptionContext.Provider value={{
            subscriptionStatus,
            subscriptionPlan,
            subscriptionEndsAt,
            customerPortalUrl,
            isPro,
            loading,
            refresh: fetchProfile
        }}>
            {children}
        </SubscriptionContext.Provider>
    )
}

export function useSubscription() {
    return useContext(SubscriptionContext)
}