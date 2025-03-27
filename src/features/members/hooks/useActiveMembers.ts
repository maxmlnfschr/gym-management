import { useMemo } from 'react';
import { Member } from '../types';

export const useActiveMembers = (members: Member[]) => {
  const activeMembers = useMemo(() => {
    return members.filter(
      (member) => !member.deleted_at && member.status !== "deleted"
    );
  }, [members]);

  return activeMembers;
};