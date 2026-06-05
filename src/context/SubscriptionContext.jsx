import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../supabase'

const SubscriptionContext = createContext({
    subscriptionStatus: 'free',
    subscriptionPlan: null,
    loading: true,
    refresh: () => {}
})

export function SubscriptionProvider({ children }) {
    const [subscriptionStatus, setSubscriptionStatus] = useState('free')
    const [subscriptionPlan, setSubscriptionPlan] = useState(null)
    const [loading, setLoading] = useState(true)

    async function fetchProfile() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            setSubscriptionStatus('free')
            setSubscriptionPlan(null)
            setLoading(false)
            return
        }
        const { data, error } = await supabase
            .from('profiles')
            .select('subscription_status, subscription_plan')
            .eq('id', user.id)
            .single()

        if (!error && data) {
            setSubscriptionStatus(data.subscription_status ?? 'free')
            setSubscriptionPlan(data.subscription_plan ?? null)
        } else {
            setSubscriptionStatus('free')
            setSubscriptionPlan(null)
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

    return (
        <SubscriptionContext.Provider value={{ subscriptionStatus, subscriptionPlan, loading, refresh: fetchProfile }}>
            {children}
        </SubscriptionContext.Provider>
    )
}

export function useSubscription() {
    return useContext(SubscriptionContext)
}