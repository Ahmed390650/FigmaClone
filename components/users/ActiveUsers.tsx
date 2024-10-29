import { useOthers, useSelf } from "@liveblocks/react";
import React, { useMemo } from "react";
import { Avatar } from "./Avatar";
import styles from "./index.module.css";
import { generateRandomName } from "@/lib/utils";
const ActiveUsers = () => {
  const users = useOthers();
  const currentUser = useSelf();
  const hasMoreUsers = users.length > 3;

  const memoizedUser = useMemo(
    () => (
      <div
        className='flex items-center justify-center gap-1'
        style={{ height: "36px" }}
      >
        <div className='flex pl-3'>
          {users && (
            <div className='relative ml-8 first:ml-0'>
              <Avatar
                name='You'
                otherStyles='border-[3px] border-primary-green'
              />
            </div>
          )}
          {users.slice(0, 2).map(({ connectionId, info }) => {
            return (
              <Avatar
                key={connectionId}
                name={generateRandomName()}
                otherStyles='-ml-3'
              />
            );
          })}

          {hasMoreUsers && (
            <div className={styles.more}>+{users.length - 3}</div>
          )}
        </div>
      </div>
    ),
    [users?.length]
  );
  return memoizedUser;
};

export default ActiveUsers;
