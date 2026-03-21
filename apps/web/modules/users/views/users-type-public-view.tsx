"use client";

import type { EmbedProps } from "app/WithEmbedSSR";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { WEBSITE_URL } from "@calcom/lib/constants";
import { BookerWebWrapper as Booker } from "@calcom/web/modules/bookings/components/BookerWebWrapper";
import { getBookerWrapperClasses } from "@calcom/features/bookings/Booker/utils/getBookerWrapperClasses";

import type { inferSSRProps } from "@lib/types/inferSSRProps";

import BookingPageErrorBoundary from "@components/error/BookingPageErrorBoundary";

import type { getServerSideProps } from "@server/lib/[user]/[type]/getServerSideProps";

export type PageProps = inferSSRProps<typeof getServerSideProps> & EmbedProps;

export const getMultipleDurationValue = (
  multipleDurationConfig: number[] | undefined,
  queryDuration: string | string[] | null | undefined,
  defaultValue: number
) => {
  if (!multipleDurationConfig) return null;
  if (multipleDurationConfig.includes(Number(queryDuration)))
    return Number(queryDuration);
  return defaultValue;
};

function Type({
  slug,
  user,
  isEmbed,
  booking,
  isBrandingHidden,
  eventData,
  orgBannerUrl,
  entity,
}: PageProps) {
  const searchParams = useSearchParams();

  return (
    <BookingPageErrorBoundary>
      <main className={getBookerWrapperClasses({ isEmbed: !!isEmbed })}>
        {!isEmbed && (
          <div>
            {entity.logoUrl && (
              <Link href={"https://ignatev.co"}>
                <img
                  className="h-10 object-cover"
                  alt="Ignatev & Co"
                  src={entity.logoUrl}
                />
              </Link>
            )}
          </div>
        )}

        <Booker
          username={user}
          eventSlug={slug}
          bookingData={booking}
          hideBranding={isBrandingHidden}
          eventData={eventData}
          entity={{ ...eventData.entity, eventTypeId: eventData?.id }}
          durationConfig={eventData.metadata?.multipleDuration}
          orgBannerUrl={orgBannerUrl}
          /* TODO: Currently unused, evaluate it is needed-
           *       Possible alternative approach is to have onDurationChange.
           */
          duration={getMultipleDurationValue(
            eventData.metadata?.multipleDuration,
            searchParams?.get("duration"),
            eventData.length
          )}
        />
      </main>
    </BookingPageErrorBoundary>
  );
}

export default Type;
