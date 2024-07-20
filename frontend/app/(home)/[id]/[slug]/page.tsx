"use client";

import { Separator } from "@/components/ui/separator";
import { fileTreeAtom, LayoutStateAtom } from "@/store/atoms";
import { useSession } from "next-auth/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

async function fetchPLayground(playgroundUrl: string) {}

async function fetchOwner(ownerId: string) {
  let ownerData: any = null;
  let err: any = null;
  fetch(`/api/user/${ownerId}`)
    .then((res) => res.json())
    .then((data) => {
      ownerData = data;
    })
    .catch((error) => {
      err = error;
    })
    .finally(() => {
      return { ownerData, err };
    });
}

export default function ViewCode({
  params,
}: {
  params: { id: string; slug: string };
}) {
  const { data: session, status } = useSession();
  const decodedId = decodeURIComponent(params.id);
  const decodedSlug = decodeURIComponent(params.slug);
  const pathName = usePathname();
  const searchParams = useSearchParams();

  // console.log(pathName, decodedId, decodedSlug); // /@souvikk431/Blue-Fig,  @souvikk431,  Blue-Fig

  const [filePath, setFilePath] = useState<string>();
  const [fileTree, setFileTree] = useRecoilState(fileTreeAtom);
  const [layoutState, setLayoutState] = useRecoilState(LayoutStateAtom);

  useEffect(() => {
    if (status === "authenticated") {
      const { user: currentUser } = session;

      // request to fetch the owner data of the playground
      fetchOwner(decodedId);

      // request to fetch the playground data
      fetchPLayground(decodedSlug);
    }
  }, [status]);

  useEffect(() => {
    setLayoutState((prev) => ({ ...prev, sidebarOpen: false }));

    // Accessing the hash fragment directly from window.location.hash
    const hashValue = decodeURIComponent(window.location.hash.substring(1)); // Remove the '#' symbol
    setFilePath(hashValue); // Assuming you want to store this in filePath state
    return () => {
      setLayoutState((prev) => ({ ...prev, sidebarOpen: true }));
      setFileTree(null);
    };
  }, []);

  return (
    <div className="items-stretch box-border flex basis-auto shrink-0 min-h-0 min-w-0 grow p-1 flex-col w-full gap-3  lg:h-[calc(-48px_+_100svh)] lg:flex-row lg:gap-3">
      <div className="items-stretch box-border flex-[1_0_auto] min-h-0 min-w-0 flex flex-row rounded-md overflow-hidden ">
        <div className="xs:flex md:w-60 items-stretch box-border basis-auto flex-col bg-accent/40  shrink-0 min-h-0 min-w-0 w-[200px] hidden px-1.5  outline-none overflow-y-auto overflow-x-hidden truncate space-y-2">
          <div className="w-full ">{/* <DirectoryTreeView folder={} /> */}</div>
          <Separator />
          <div className="w-full ">config</div>
        </div>
        <div className="items-stretch box-border flex flex-[1_0_auto] flex-col min-h-0 min-w-0  outline-none"></div>
      </div>
      <div className="items-stretch box-border flex basis-auto shrink-0 min-h-0 min-w-0 flex-col gap-3 w-[400px]  outline-none ">
        Edit in workspace
      </div>
    </div>
  );
}
