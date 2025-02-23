import { Member } from '@/features/members/types';

export const exportToCsv = (members: Member[]) => {
  const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Status'];
  const csvContent = [
    headers.join(','),
    ...members.map(member => [
      member.first_name,
      member.last_name,
      member.email,
      member.phone || '',
      member.status
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `members_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};