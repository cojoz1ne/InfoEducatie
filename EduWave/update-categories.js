const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://glnulocbjdkudoiordhh.supabase.co',
  'sb_secret_JAjMw9ewwfiTbedfBtxcWQ_puR1sH9n'
);

async function run() {
  console.log('--- Fetching all courses ---');
  const { data: courses, error: fetchErr } = await supabase.from('courses').select('*');
  if (fetchErr) {
    console.error('Error fetching courses:', fetchErr);
    return;
  }

  console.log('Found courses:', courses.map(c => ({ id: c.id, title: c.title, category: c.category })));

  console.log('\n--- Updating all courses to category: Informatică ---');
  const { data: updated, error: updateErr } = await supabase
    .from('courses')
    .update({ category: 'Informatică' })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // match all
  
  if (updateErr) {
    console.error('Error updating courses:', updateErr);
  } else {
    console.log('Successfully updated all courses to Informatică!');
  }

  // Fetch again to verify
  const { data: coursesAfter, error: fetchAfterErr } = await supabase.from('courses').select('*');
  if (!fetchAfterErr) {
    console.log('\nVerification - courses after update:', coursesAfter.map(c => ({ id: c.id, title: c.title, category: c.category })));
  }
}

run();
