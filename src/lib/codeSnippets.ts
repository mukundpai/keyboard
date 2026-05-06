import type { CodeLanguage } from '@/types/typing';

const PYTHON_SNIPPETS = [
  `def fibonacci(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(n - 1):
        a, b = b, a + b
    return b`,

  `class Stack:
    def __init__(self):
        self.items = []

    def push(self, item):
        self.items.append(item)

    def pop(self):
        if not self.is_empty():
            return self.items.pop()

    def is_empty(self):
        return len(self.items) == 0`,

  `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
];

const REACT_SNIPPETS = [
  `import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}`,

  `export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex gap-4 items-center">
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <span className="text-2xl font-bold">{count}</span>
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}`,

  `const fetcher = (url) => fetch(url).then(r => r.json());

export function UserProfile({ userId }) {
  const { data, error, isLoading } = useSWR(
    userId ? \`/api/users/\${userId}\` : null,
    fetcher
  );

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState message={error.message} />;
  return <ProfileCard user={data} />;
}`,
];

const DJANGO_SNIPPETS = [
  `from django.db import models

class Article(models.Model):
    title = models.CharField(max_length=200)
    body = models.TextField()
    author = models.ForeignKey(
        'auth.User',
        on_delete=models.CASCADE,
        related_name='articles',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title`,

  `from rest_framework import serializers, viewsets
from .models import Article

class ArticleSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(
        source='author.username', read_only=True
    )

    class Meta:
        model = Article
        fields = ['id', 'title', 'body', 'author_name', 'created_at']
        read_only_fields = ['created_at']`,

  `from django.views import View
from django.http import JsonResponse
from django.contrib.auth.mixins import LoginRequiredMixin

class DashboardView(LoginRequiredMixin, View):
    def get(self, request):
        articles = request.user.articles.order_by('-created_at')[:10]
        data = [{'id': a.id, 'title': a.title} for a in articles]
        return JsonResponse({'articles': data})`,
];

const ALL: Record<CodeLanguage, string[]> = {
  python: PYTHON_SNIPPETS,
  react: REACT_SNIPPETS,
  django: DJANGO_SNIPPETS,
};

/** Return a random code snippet for the given language */
export function getCodeSnippet(lang: CodeLanguage): string {
  const pool = ALL[lang];
  return pool[Math.floor(Math.random() * pool.length)];
}
