"use client"

import * as React from "react"
import { toast } from "sonner"

import * as api from "./mock-api"
import type { NewPostInput, Post } from "./types"

type LoadState = "loading" | "ready" | "error"

interface State {
  loadState: LoadState
  error: string | null
  posts: Post[]
  /** ids of posts with an in-flight retry */
  retrying: string[]
}

type Action =
  | { type: "load:start" }
  | { type: "load:success"; posts: Post[] }
  | { type: "load:error"; error: string }
  | { type: "upsert"; post: Post }
  | { type: "remove"; id: string }
  | { type: "retry:start"; id: string }
  | { type: "retry:end"; id: string }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "load:start":
      return { ...state, loadState: "loading", error: null }
    case "load:success":
      return { ...state, loadState: "ready", posts: action.posts }
    case "load:error":
      return { ...state, loadState: "error", error: action.error }
    case "upsert": {
      const exists = state.posts.some((p) => p.id === action.post.id)
      return {
        ...state,
        posts: exists
          ? state.posts.map((p) => (p.id === action.post.id ? action.post : p))
          : [...state.posts, action.post],
      }
    }
    case "remove":
      return { ...state, posts: state.posts.filter((p) => p.id !== action.id) }
    case "retry:start":
      return { ...state, retrying: [...state.retrying, action.id] }
    case "retry:end":
      return { ...state, retrying: state.retrying.filter((id) => id !== action.id) }
  }
}

interface PostsContextValue extends State {
  reload: () => void
  createPost: (input: NewPostInput) => Promise<Post>
  retryPost: (id: string) => Promise<void>
  deletePost: (id: string) => Promise<void>
}

const PostsContext = React.createContext<PostsContextValue | null>(null)

function readSimulation(): api.Simulation {
  const value = new URLSearchParams(window.location.search).get("simulate")
  return value === "error" || value === "empty" ? value : null
}

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, {
    loadState: "loading",
    error: null,
    posts: [],
    retrying: [],
  })

  // Keep a ref so async callbacks always see the latest posts without re-creating.
  const postsRef = React.useRef(state.posts)
  React.useEffect(() => {
    postsRef.current = state.posts
  }, [state.posts])

  const load = React.useCallback(async (simulate: api.Simulation) => {
    dispatch({ type: "load:start" })
    try {
      const posts = await api.fetchPosts(simulate)
      dispatch({ type: "load:success", posts })
    } catch (err) {
      dispatch({ type: "load:error", error: err instanceof Error ? err.message : "Something went wrong." })
    }
  }, [])

  React.useEffect(() => {
    void load(readSimulation())
  }, [load])

  // "Try again" should recover from a simulated error, so it ignores the flag.
  const reload = React.useCallback(() => void load(null), [load])

  const createPost = React.useCallback(async (input: NewPostInput) => {
    const post = await api.createPost(input)
    dispatch({ type: "upsert", post })
    return post
  }, [])

  const retryPost = React.useCallback(async (id: string) => {
    const previous = postsRef.current.find((p) => p.id === id)
    if (!previous || previous.status !== "failed") return

    // Optimistic update: show it as published right away…
    dispatch({ type: "retry:start", id })
    dispatch({ type: "upsert", post: { ...previous, status: "published", errorMessage: undefined } })

    try {
      const saved = await api.retryPost(id)
      dispatch({ type: "upsert", post: saved })
      toast.success("Post published", { description: "The retry went through on every channel." })
    } catch (err) {
      // …and roll back to the exact previous version if the API call fails.
      dispatch({ type: "upsert", post: previous })
      toast.error("Retry failed — changes rolled back", {
        description: err instanceof Error ? err.message : "Please try again.",
      })
    } finally {
      dispatch({ type: "retry:end", id })
    }
  }, [])

  const deletePost = React.useCallback(async (id: string) => {
    const previous = postsRef.current.find((p) => p.id === id)
    if (!previous) return
    dispatch({ type: "remove", id })
    try {
      await api.deletePost(id)
      toast("Post deleted")
    } catch {
      dispatch({ type: "upsert", post: previous })
      toast.error("Couldn't delete the post")
    }
  }, [])

  const value = React.useMemo<PostsContextValue>(
    () => ({ ...state, reload, createPost, retryPost, deletePost }),
    [state, reload, createPost, retryPost, deletePost]
  )

  return <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
}

export function usePosts() {
  const ctx = React.useContext(PostsContext)
  if (!ctx) throw new Error("usePosts must be used inside <PostsProvider>")
  return ctx
}
