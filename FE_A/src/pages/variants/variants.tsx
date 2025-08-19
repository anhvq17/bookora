import { Table, Button, Space, Popconfirm, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/config/axios.customize';
import { IVariant } from '@/types/variants';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Link } from 'react-router';
import { getVariantsColums } from '../contants/variantsColums';

const VariantsList = () => {
  const queryClient = useQueryClient();

  // Fetch danh sách biến thể
  const { data: variants = [], isLoading } = useQuery<IVariant[]>({
    queryKey: ['variants'],
    queryFn: async () => {
      const res = await api.get('/api/variants');
      return res.data.data;
    },
  });

  // Mutation xoá biến thể
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/variants/${id}`);
    },
    onSuccess: () => {
      message.success('Xoá biến thể thành công');
      queryClient.invalidateQueries({ queryKey: ['variants'] });
    },
    onError: () => {
      message.error('Xoá thất bại');
    }
  });

  // Hàm xoá
  const Del = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columns = getVariantsColums(queryClient, Del)

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }}>

      <h2>Danh sách biến thể</h2>
      <Link to={'/variants/add'}>
                <Button icon={<PlusOutlined />} size="small" style={{ backgroundColor: 'white', color: 'dodgerblue', borderColor: 'dodgerblue' }}></Button>
              </Link>
              </div>
      <Table
        columns={columns}
        dataSource={variants}
        loading={isLoading}
        rowKey={(record) => record._id}
        pagination={{ pageSize: 10 }}
      />
    </>
  );
};

export default VariantsList;
