class TokenManager {
  private accessToken: string | null = null
  setAccessToken(accessToken: string): void {
    this.accessToken = accessToken
    localStorage.setItem('accessToken', accessToken)
  }

  getAccessToken(): string | null {
    if (!this.accessToken) {
      this.accessToken = localStorage.getItem('accessToken')
    }
    return this.accessToken
  }

  clearAccessToken(): void {
    this.accessToken = null
    localStorage.removeItem('accessToken')
  }
}

export const tokenManager = new TokenManager()