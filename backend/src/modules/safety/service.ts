// reportContent(reporterId: string, targetType: string, targetId: string, reason: string): Promise<Report>
// checkAutoHide(targetId: string): Promise<void>  -- hide if 5 reports in 1h
// autoMuteSpammer(userId: string): Promise<void>  -- triggered by messageLimiter
// filterHateSpeech(text: string): string  -- replace bad words with 🚫
// getReportsForModeration(): Promise<Report[]>  -- mod team only
// resolveReport(reportId: string, action: string): Promise<void>  -- mod team only
