'use client';

import { useParams, useRouter } from 'next/navigation';
import { useInviteDetails, useAcceptInvite, InviteStatus } from '@/lib/hooks/use-invites';
import { useProfile } from '@/lib/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { PageWrapper } from '@/components/layout/page-wrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, Users, AlertCircle, CheckCircle2, LogIn } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { format } from 'date-fns';

export default function InvitePage() {
    const params = useParams();
    const router = useRouter();
    const token = params.token as string;
    const { data: invite, isLoading, isError, error } = useInviteDetails(token);
    const { mutate: acceptInvite, isPending: isAccepting } = useAcceptInvite();
    const { data: profile } = useProfile();

    const handleAccept = () => {
        acceptInvite(token, {
            onSuccess: () => {
                router.push(`${ROUTES.GROUPS}/${invite?.entityId}`);
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError || !invite) {
        return (
            <PageWrapper>
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <Card className="w-full max-w-md shadow-lg border-red-100 dark:border-red-900/30">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                            </div>
                            <CardTitle className="text-2xl font-bold">Invalid Invitation</CardTitle>
                            <CardDescription>
                                This invitation link is invalid or has expired.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center text-muted-foreground pt-4">
                            <p>Please ask the group owner to send you a new invitation link.</p>
                        </CardContent>
                        <CardFooter className="flex justify-center pb-8 border-t dark:border-border/50 pt-6">
                            <Button onClick={() => router.push(ROUTES.DASHBOARD)} variant="outline">
                                Go to Dashboard
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </PageWrapper>
        );
    }

    const { entityDetails, status, invitedAt, isExpired } = invite;
    const isAccepted = status === InviteStatus.ACCEPTED;
    const isLoggedIn = !!profile;

    return (
        <PageWrapper>
            <div className="flex flex-col items-center justify-center py-12 md:py-20 px-4">
                <Card className="w-full max-w-lg shadow-xl overflow-hidden border-none bg-background/80 backdrop-blur-sm ring-1 ring-border">
                    <div className="h-2 bg-gradient-to-r from-primary to-accent" />
                    <CardHeader className="text-center pb-6">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 ring-4 ring-primary/5">
                            <Users className="w-8 h-8 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight">You're Invited!</CardTitle>
                        <CardDescription className="text-base mt-2">
                            Join the group and start tracking expenses together
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <div className="bg-muted/50 dark:bg-muted/20 p-6 rounded-2xl border border-border/50">
                            <div className="flex flex-col items-center gap-4">
                                <h2 className="text-2xl font-bold text-center text-foreground">
                                    {entityDetails.groupName}
                                </h2>
                                {entityDetails.description && (
                                    <p className="text-center text-muted-foreground text-sm italic">
                                        "{entityDetails.description}"
                                    </p>
                                )}
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs text-muted-foreground uppercase font-semibold">Members</span>
                                        <span className="text-lg font-bold">{entityDetails.memberCount}</span>
                                    </div>
                                    <div className="w-px h-8 bg-border" />
                                    <div className="flex flex-col items-center">
                                        <span className="text-xs text-muted-foreground uppercase font-semibold">Invited By</span>
                                        <span className="text-lg font-bold">{entityDetails.createdBy.username}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-center text-muted-foreground">
                            Invitation sent on {format(new Date(invitedAt), 'PPP')}
                        </div>

                        {isAccepted && (
                            <div className="bg-green-100/50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-xl flex items-center gap-3 border border-green-200/50 dark:border-green-900/50">
                                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                                <span className="font-medium text-sm">You have already accepted this invitation.</span>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3 pb-8 px-6">
                        {!isLoggedIn ? (
                            <div className="w-full space-y-4">
                                <div className="p-4 bg-amber-50 dark:bg-amber-900/10 text-amber-800 dark:text-amber-400 rounded-xl border border-amber-200/50 dark:border-amber-900/50 flex items-center gap-3">
                                    <LogIn className="w-5 h-5" />
                                    <p className="text-sm font-medium">Please login to join this group</p>
                                </div>
                                <Button
                                    className="w-full h-12 text-lg font-semibold"
                                    onClick={() => router.push(`${ROUTES.LOGIN}?redirect=/invites/${token}`)}
                                >
                                    Login to Accept
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full h-12"
                                    onClick={() => router.push(`${ROUTES.SIGNUP}?redirect=/invites/${token}`)}
                                >
                                    Create New Account
                                </Button>
                            </div>
                        ) : isAccepted ? (
                            <Button
                                className="w-full h-12 text-lg font-semibold"
                                onClick={() => router.push(`${ROUTES.GROUPS}/${invite.entityId}`)}
                            >
                                Go to Group
                            </Button>
                        ) : (
                            <Button
                                className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20"
                                onClick={handleAccept}
                                disabled={isAccepting || isExpired}
                            >
                                {isAccepting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                        Joining...
                                    </>
                                ) : (
                                    'Accept Invite & Join Group'
                                )}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </PageWrapper>
    );
}
